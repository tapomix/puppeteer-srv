<?php

namespace npm;

use Castor\Attribute\AsRawTokens;
use Castor\Attribute\AsTask;

use function Castor\context;

/** @param string[] $args */
#[AsTask(description: 'Execute an npm command', aliases: ['npm'])]
function run(
    #[AsRawTokens]
    array $args = [],
): void {
    \docker\run(SERVICE_NPM, \array_merge(['npm'], $args), context('interactive'));
}
