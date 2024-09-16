<?php

namespace App\Utils\Enum;

/**
 * Enumerates all available statuses (states) for user's account
 */
enum UserStatusEnum: string
{
    case CREATED = 'CREATED';
    case ACTIVE = 'ACTIVE';
    case BANNED = 'BANNED';
    case DELETED = 'DELETED';
}
