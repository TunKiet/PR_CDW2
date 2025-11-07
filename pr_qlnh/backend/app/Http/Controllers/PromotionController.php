<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;

class PromotionController extends Controller {
    public function index() {
        $promos = Promotion::orderBy('promotion_id','desc')->get();
        return response()->json(['status'=>'success','promotions'=>$promos]);
    }

    public function show($id) {
        $promo = Promotion::findOrFail($id);
        return response()->json(['status'=>'success','promotion'=>$promo]);
    }

    public function store(Request $req) {
        $req->validate([
            'code'=>'required|string|unique:promotions,code',
            'title'=>'required|string',
            'discount_type'=>'required|in:percent,fixed',
            'discount_value'=>'required|numeric|min:0',
            'expired_at'=>'nullable|date',
            'max_uses'=>'nullable|integer|min:0'
        ]);

        $promo = Promotion::create($req->only(['code','title','description','discount_type','discount_value','max_uses','expired_at','status']));
        return response()->json(['message'=>'Promotion created','promotion'=>$promo], 201);
    }

    public function update(Request $req, $id) {
        $promo = Promotion::findOrFail($id);
        $req->validate([
            'code'=>'required|string|unique:promotions,code,'.$id.',promotion_id',
            'title'=>'required|string',
            'discount_type'=>'required|in:percent,fixed',
            'discount_value'=>'required|numeric|min:0',
            'expired_at'=>'nullable|date',
            'max_uses'=>'nullable|integer|min:0'
        ]);
        $promo->update($req->only(['code','title','description','discount_type','discount_value','max_uses','expired_at','status']));
        return response()->json(['message'=>'Promotion updated','promotion'=>$promo]);
    }

    public function destroy($id) {
        Promotion::findOrFail($id)->delete();
        return response()->json(['message'=>'Promotion deleted']);
    }

    // validate code (POST: code)
    public function validateCode(Request $req) {
        $req->validate(['code'=>'required|string']);
        $promo = Promotion::where('code', $req->code)
            ->where('status','active')
            ->where(function($q){ $q->whereNull('expired_at')->orWhere('expired_at','>',now()); })
            ->where(function($q){ $q->whereNull('max_uses')->orWhereColumn('used_count','<','max_uses'); })
            ->first();

        if (!$promo) return response()->json(['valid'=>false,'message'=>'Mã không hợp lệ hoặc đã hết hạn'], 404);

        return response()->json([
            'valid'=>true,
            'promotion'=>$promo
        ]);
    }
}
