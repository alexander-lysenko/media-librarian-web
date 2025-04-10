@extends('errors::minimal')

@section('title', __('Error'))
@section('code', $exception->getStatusCode())
@section('message', __($exception->getMessage() ?: 'Forbidden'))
