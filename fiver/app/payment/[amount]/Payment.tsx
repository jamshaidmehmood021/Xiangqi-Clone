"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutPage from "@/app/components/CheckoutPage";

import convertToSubcurrency from "@/app/lib/convertToSubcurrency";


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Payment = ({ params }: { params: { amount: string } }) => {
  const { amount } = params;
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr" style={{background: 'linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(70, 70, 70, 1) 50%, rgba(30, 30, 30, 0.8) 100%)', minHeight: '100vh'}}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Secure Checkout</h1>
        <p className="text-lg text-gray-600 mb-4">You are about to pay <span className="font-bold text-blue-500">${amount}</span></p>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(Number(amount)),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={Number(amount)}/>
        </Elements>
      </div>
    </main>
  );
}

export default Payment;
