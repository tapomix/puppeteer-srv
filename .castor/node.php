<?php

namespace node;

use Castor\Attribute\AsRawTokens;
use Castor\Attribute\AsTask;

use function Castor\context;

/** @param string[] $args */
#[AsTask(description: 'Execute an npm command', aliases: ['npm'])]
function npm(
    #[AsRawTokens]
    array $args = [],
): void {
    \docker\run(SERVICE_NODE, array_merge(['npm'], $args), context('interactive'));
}
