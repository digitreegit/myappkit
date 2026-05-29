# 패턴: 구독 / 결제 (Stripe + Supabase)

SaaS 구독 기본 골격. Stripe Checkout + Webhook + Supabase 저장.

## 1) Checkout 세션 생성 (서버)

```ts
// app/api/checkout/route.ts (Next.js)
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId, userId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.APP_URL}/pricing`,
    client_reference_id: userId,
  });
  return Response.json({ url: session.url });
}
```

## 2) Webhook 으로 구독 상태 저장

```ts
// app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;
    await supabase.from("subscriptions").upsert({
      user_id: sub.metadata.userId,
      status: sub.status,
      price_id: sub.items.data[0]?.price.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    });
  }
  return new Response("ok");
}
```

## 3) 구독 상태 훅

```tsx
import { createCrud } from "@skyface/api";
import { supabase } from "@/lib/supabase";

interface Subscription { user_id: string; status: string; price_id: string; current_period_end: string }
const subs = createCrud<Subscription>(supabase, "subscriptions");

export async function getActiveSubscription(userId: string) {
  const { data } = await subs.list({ match: { user_id: userId, status: "active" }, limit: 1 });
  return data?.[0] ?? null;
}
```

## 테이블 (Supabase)
```sql
create table subscriptions (
  user_id uuid references auth.users(id) primary key,
  status text not null,
  price_id text,
  current_period_end timestamptz
);
alter table subscriptions enable row level security;
create policy "own subscription" on subscriptions for select using (auth.uid() = user_id);
```
