<?php

// Guard against redefinition when this file is imported/mounted by another castor.php
defined('CASTOR_USE_CHDIR') || define('CASTOR_USE_CHDIR', true);

use function Castor\import;

import(__DIR__);
