<?php

use Castor\Attribute\AsContext;
use Castor\Context;

use function Castor\load_dot_env;

#[AsContext(default: true)]
function default_context(): Context
{
    $context = (new Context(load_dot_env(__DIR__ . '/../' . DOCKER_ENV)))->withAllowFailure();

    // only enable TTY in interactive mode (manual console usage)
    if (stream_isatty(STDIN) && stream_isatty(STDOUT)) {
        $context = $context->withTty();
    }

    return $context;
}
