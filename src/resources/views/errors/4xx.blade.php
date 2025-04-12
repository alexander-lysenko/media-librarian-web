@extends('errors::minimal')

@section('title', trans('Error'))
@section('code', $exception->getStatusCode())
@section('message', trans($exception->getMessage()))
