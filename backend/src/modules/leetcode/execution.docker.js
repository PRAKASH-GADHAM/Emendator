'use strict';

// Containerized execution sandbox for untrusted LeetCode submissions.
//
// When DOCKER_EXEC_MODE=1, execution.service.js routes each phase (compile and
// run) into a dedicated `emendator-executor` image via `docker run`, so
// untrusted code never runs directly inside the backend process/host. Every
// run enforces a hardened isolation boundary:
//   - network disabled          (--network none)
//   - all capabilities dropped  (--cap-drop ALL)
//   - no new privileges         (--security-opt no-new-privileges)
//   - non-root, nobody user     (--user 65534:65534)
//   - read-only root + tmpfs    (--read-only, --tmpfs /tmp)
//   - memory / CPU / pid limits (--memory, --memory-swap, --cpus, --pids-limit)
//   - hard stop timeout         (--stop-timeout)
//   - ephemeral                 (--rm)
//
// The ONLY host path injected is the per-run temp directory (submitted source
// + compiled artifacts), mounted read-write at /workspace. Submitted code is
// NEVER given a Docker socket, database credentials, API keys, application
// environment, or other host filesystem access.
//
// Deployment note (MUST be verified with a running Docker daemon):
//   - Developer host: runDir is a local path and is bound directly.
//   - Production compose: backend and executor must share a work volume at the
//     same absolute temp path (see docker-compose.yml emendator_work).
// The bridge is opt-in (DOCKER_EXEC_MODE=1) and defaults OFF so the proven
// non-container path is unchanged until the sandbox is validated.

const { spawn } = require('child_process');

const EXECUTOR_IMAGE = process.env.DOCKER_EXECUTOR_IMAGE || 'emendator-executor:latest';
const EXEC_TIMEOUT_MS = 10000;
const MAX_OUTPUT_BYTES = 65536;

const isEnabled = () => process.env.DOCKER_EXEC_MODE === '1';

const isolationArgs = (name) => [
    '--rm',
    '--name=' + name,
    '--network=none',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    '--user=65534:65534',
    '--read-only',
    '--tmpfs=/tmp:rw,noexec,nosuid,size=128m',
    '--memory=256m',
    '--memory-swap=256m',
    '--cpus=1',
    '--pids-limit=128',
    '--stop-timeout=5',
];

let runCounter = 0;
const nextName = () => `emend_exec_${process.pid}_${(++runCounter).toString(36)}`;

const removeContainer = (name) => {
    const rm = spawn('docker', ['rm', '-f', name], { stdio: 'ignore' });
    rm.on('error', () => {});
    setTimeout(() => {
        const retry = spawn('docker', ['rm', '-f', name], { stdio: 'ignore' });
        retry.on('error', () => {});
    }, 700);
};

const runInSandbox = ({ args, dir, input, timeoutMs = EXEC_TIMEOUT_MS }) => {
    return new Promise((resolve) => {
        const name = nextName();
        const startTime = Date.now();
        const runArgs = ['run', ...isolationArgs(name)];
        if (dir) runArgs.push('-v', `${dir}:/workspace:rw`);
        runArgs.push(EXECUTOR_IMAGE, ...args);

        const proc = spawn('docker', runArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

        let stdout = '';
        let stderr = '';
        let killed = false;
        let resolved = false;

        const safeResolve = (result) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeoutId);
            resolve(result);
        };

        const terminate = () => {
            if (killed) return;
            killed = true;
            proc.kill('SIGKILL');
            removeContainer(name);
        };

        const timeoutId = setTimeout(() => {
            terminate();
            safeResolve({ status: 'TIMEOUT', runtime: Date.now() - startTime, stdout: '', stderr: '' });
        }, timeoutMs);

        proc.stdout.on('data', (d) => {
            stdout += d.toString();
            if (stdout.length > MAX_OUTPUT_BYTES && !killed) {
                terminate();
            }
        });
        proc.stderr.on('data', (d) => { stderr += d.toString(); });

        proc.on('close', (code) => {
            const runtime = Date.now() - startTime;
            if (killed && runtime >= timeoutMs) {
                safeResolve({ status: 'TIMEOUT', runtime, stdout: '', stderr: '' });
                return;
            }
            if (killed) {
                safeResolve({ status: 'RUNTIME_ERROR', runtime, stdout: '', stderr: 'Output limit exceeded' });
                return;
            }
            if (code !== 0 && !stdout.trim()) {
                safeResolve({ status: 'RUNTIME_ERROR', runtime, stdout: '', stderr: stderr.slice(0, 2000) });
                return;
            }
            safeResolve({ status: 'OK', runtime, stdout: stdout.trim(), stderr: stderr.slice(0, 2000) });
        });
        proc.on('error', () => {
            safeResolve({ status: 'RUNTIME_ERROR', runtime: Date.now() - startTime, stdout: '', stderr: 'Sandbox unavailable (is Docker running?)' });
        });

        if (input) {
            try { proc.stdin.write(input); } catch {}
        }
        proc.stdin.end();
    });
};

// Java: source (Solution.java + harness Main.java) is already written into the
// mounted /workspace by the caller. Compile and run in one container so the
// .class artifacts persist on the mounted dir.
const compileJavaInSandbox = async (dir, className) => {
    const res = await runInSandbox({
        dir,
        args: ['sh', '-c', `javac -d /workspace /workspace/${className}.java /workspace/Main.java`],
        timeoutMs: 15000,
    });
    return res.status === 'OK'
        ? { success: true }
        : { success: false, error: res.stderr || res.stdout || 'Compilation failed' };
};

const runJavaInSandbox = async (dir, className, input) =>
    runInSandbox({ dir, args: ['java', '-cp', '/workspace', 'Main'], input });

const runJavaScriptInSandbox = async (code, input) => {
    const fullCode = input
        ? `const __input = ${JSON.stringify(input)};\n${code}`
        : code;
    return runInSandbox({ args: ['node', '-e', fullCode] });
};

const runPythonInSandbox = async (code, input) => {
    const full = input ? `import sys\n__input=${JSON.stringify(input)}\n${code}` : code;
    return runInSandbox({ args: ['python3', '-c', full] });
};

// C++: source is written into the mounted /workspace by the caller
// (solution.cpp). Compile and run in one container.
const runCppInSandbox = async (dir, code, input) =>
    runInSandbox({
        dir,
        args: ['sh', '-c', 'g++ -o /workspace/solution /workspace/solution.cpp -std=c++17 -O2 && /workspace/solution'],
        input,
    });

module.exports = {
    isEnabled,
    runInSandbox,
    compileJavaInSandbox,
    runJavaInSandbox,
    runJavaScriptInSandbox,
    runPythonInSandbox,
    runCppInSandbox,
};
