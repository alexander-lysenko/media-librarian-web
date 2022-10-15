<?php

namespace App\Rules;

use App\Services\UserDatabaseService;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\App;

class UniqueUserCollection implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        /** @var UserDatabaseService $dbService */
        $dbService = App::make(UserDatabaseService::class);

        return !$dbService->getDbConnection()->getSchemaBuilder()->hasTable($value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'The :attribute has already been taken.';
    }
}
