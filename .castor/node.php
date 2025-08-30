<?php

namespace node;

use Castor\Attribute\AsArgument;
use Castor\Attribute\AsTask;

use function Castor\context;

/** @param string $cmd */
#[AsTask(description: 'Excute npm command', aliases: ['npm'])]
function npm(
    #[AsArgument(description: 'Command to execute')]
    ?string $cmd = null,
): void
{
    \docker\run(SERVICE_NODE, array_merge(['npm'], [(string) $cmd]), context()->withAllowFailure());
}
