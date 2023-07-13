<?php

namespace App\Http\Controllers;

use App\Events\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function message(Request $request)
    {
        event(new Message(
            $request->input('sender_id'),
            $request->input('recipient_id'),
            $request->input('content')
        ));
        return  [];
    }
}
