<?php

namespace docker;

use Castor\Attribute\AsTask;
use Castor\Console\Output\VerbosityLevel;
use Castor\Context;
use Castor\Exception\ProblemException;
use Symfony\Component\Process\Process;

use function Castor\context;
use function Castor\fs;
use function Castor\io;
use function Castor\run as castor_run;

#[AsTask(description: 'Build all services', aliases: ['build'])]
function build(bool $noCache = false): void
{
    io()->title('Building server');

    castor_run(\array_merge(buildBaseDockerComposeCmd(), \array_merge(['build'], $noCache ? ['--no-cache'] : [])), context: context()->withVerbosityLevel(VerbosityLevel::VERBOSE));
}

#[AsTask(description: 'Start server (aka compose up)', aliases: ['start', 'up'])]
function start(): void
{
    io()->title('Starting server');

    castor_run(\array_merge(buildBaseDockerComposeCmd(), ['up', '--detach', '--wait']));
}

#[AsTask(description: 'Stopping server (aka compose down)', aliases: ['stop', 'down'])]
function stop(): void
{
    io()->title('Stopping server');

    castor_run(\array_merge(buildBaseDockerComposeCmd(), ['down', '--remove-orphans']));
}

#[AsTask(description: 'Show server logs', aliases: ['logs'])]
function logs(): void
{
    io()->title('Showing server logs');

    castor_run(\array_merge(buildBaseDockerComposeCmd(), ['logs', '-f']));
}

#[AsTask(description: 'Open terminal in container', aliases: ['sh'])]
function shell(string $service): void
{
    \docker\exec($service, ['bash'], context()->withTty(true));
}

/** @return string[] */
function buildBaseDockerComposeCmd(): array
{
    $envCompose = 'compose.' . $_SERVER['APP_ENV'] . '.yaml';

    if (!fs()->exists($envCompose)) {
        throw new ProblemException('Specific Docker Compose not found');
    }

    if (!fs()->exists(DOCKER_ENV)) {
        throw new ProblemException('Docker Compose config not found');
    }

    $composes = [
        'compose.yaml', // base file
        $envCompose, // env specific file
    ];

    if (fs()->exists('compose.override.yaml')) {
        $composes[] = 'compose.override.yaml'; // custom file
    }

    $cmd = [
        'docker',
        'compose',
    ];

    foreach ($composes as $compose) {
        $cmd[] = '-f';
        $cmd[] = $compose;
    }

    $cmd[] = '--env-file=' . DOCKER_ENV;

    return $cmd;
}

/** @param string[] $command */
function run(string $service, array $command, ?Context $context = null): Process
{
    $context ??= context();

    return castor_run(\array_merge(buildBaseDockerComposeCmd(), ['run', '--rm'], [$service], $command), context: $context);
}

/** @param string[] $command */
function exec(string $service, array $command, ?Context $context = null): Process
{
    $context ??= context();

    return castor_run(\array_merge(buildBaseDockerComposeCmd(), ['exec'], [$service], $command), context: $context);
}
