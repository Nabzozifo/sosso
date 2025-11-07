<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SoussouDataService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(SoussouDataService::class, function ($app) {
            return new SoussouDataService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
