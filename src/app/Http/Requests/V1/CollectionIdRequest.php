<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteCollectionMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the ID of an existing collection during view/update/delete the collection
 * @property int $id
 */
class CollectionIdRequest extends FormRequest
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
        $collectionMetaClass = SqliteCollectionMeta::class;

        return [
            'id' => ['required', 'integer', 'min:1', "exists:{$collectionMetaClass},id", Rule::exists()],
        ];
    }
}
