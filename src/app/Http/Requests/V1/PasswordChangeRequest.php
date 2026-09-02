<?php

namespace App\Http\Requests\V1;

use App\Rules\PasswordValidationRule;
use App\Utils\Enum\UserStatusEnum;
use Illuminate\Foundation\Http\FormRequest;

class PasswordChangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $availableStatuses = [UserStatusEnum::ACTIVE, UserStatusEnum::BANNED];

        return !empty($this->user()->email) && in_array($this->user()->status, $availableStatuses, true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'password' => ['required', 'string', new PasswordValidationRule($this->user()->email)],
            'newPassword' => ['required', 'string', 'min:8', 'different:password'],
            'repeatPassword' => ['required', 'string', 'same:newPassword'],
        ];
    }
}
