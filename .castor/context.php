<?php

use Castor\Attribute\AsContext;
use Castor\Context;

use function Castor\context;
use function Castor\load_dot_env;

#[AsContext(default: true)]
function default_context(): Context
{
    return (new Context(load_dot_env(__DIR__ . '/../' . ENV_FILE)))->withAllowFailure();
}

#[AsContext(name: 'interactive')]
function interactive_context(): Context
{
    return context()->toInteractive()->withTty();
}
