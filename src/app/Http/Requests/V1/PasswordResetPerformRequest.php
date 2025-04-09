<?php

namespace App\Http\Requests\V1;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate email, password and password reset token upon password reset action
 * @property string $email
 * @property string $newPassword
 * @property string $repeatPassword
 * @property string $token
 */
class PasswordResetPerformRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'newPassword' => ['required', 'string', 'min:8'],
            'repeatPassword' => ['required', 'string', 'same:newPassword'],
            'token' => [
                'required',
                'string',
                Rule::exists('password_resets', 'token')->where(function (Builder $query) {
                    $query->where('email', $this->input('email'));
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.exists' => trans('validation.email.exists'),
            'token.exists' => trans('validation.token.expired'),
        ];
    }
}
