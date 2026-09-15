<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecordManualPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_id' => 'required|exists:members,id',
            'payment_type_id' => 'required|exists:payment_types,id',
            'amount' => 'required|numeric|min:100',
            'payment_method' => 'required|in:cash,bank_transfer',
            'payment_date' => 'required|date',
            'reference' => 'nullable|string|max:100',
        ];
    }
}
