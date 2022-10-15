<?php

namespace App\Http\Requests\V1;

use App\Rules\UniqueUserCollection;
use App\Utils\Enum\InputDataTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCollectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string',  new UniqueUserCollection()],
            'fields.*' => ['required', 'array:name,type', 'max:30'],

            'fields.*.name' => ['required', 'string', 'distinct'],
            'fields.*.type' => ['required', 'string', Rule::in(InputDataTypeEnum::TYPE_UI_NAME)],
            'fields.0.type' => [Rule::in(InputDataTypeEnum::LINE_INPUT)],
        ];
    }
}
