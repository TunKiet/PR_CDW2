<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;

    public function __construct($reservation)
    {
        $this->reservation = $reservation;
    }

    public function build()
    {
        return $this->subject('Xác nhận đặt bàn - Nhà hàng')
                    ->markdown('emails.reservation_confirmed')
                    ->with([
                        'reservation' => $this->reservation
                    ]);
    }
}
