<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitiatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_type_id' => 'required|exists:payment_types,id',
            'amount' => 'required|numeric|min:100',
        ];
    }
}
