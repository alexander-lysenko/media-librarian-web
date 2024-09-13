<?php

namespace App\Utils\Enum;

/**
 * List of available statuses (states) for user's account
 */
enum UserStatusEnum: string
{
    case STATUS_CREATED = 'CREATED';
    case STATUS_ACTIVE = 'ACTIVE';
    case STATUS_BANNED = 'BANNED';
    case STATUS_DELETED = 'DELETED';
}
