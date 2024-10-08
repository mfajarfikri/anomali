<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Anomali;

class ApiController extends Controller
{
    public function countNewStatus()
    {
        $jumlahStatusNew = Anomali::where('status_id', 1)->count();

        return response()->json([
            'jumlah' => $jumlahStatusNew
        ]);
    }
}
