import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {useForm, type FieldError, type UseFormRegisterReturn} from 'react-hook-form';
import {z} from 'zod';
import {brand} from '@/data/brand';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {lockScroll} from '@/hooks/useLenis';
import {formatINR} from '@/lib/format';
import {backdropVariants, EASE_EXPO, modalVariants} from '@/lib/motion';
import {submitOrder, type OrderResult} from '@/lib/order';
import {zodResolver} from '@/lib/zodResolver';
import {selectSubtotal, useCartStore} from '@/store/cartStore';
import {useUiStore} from '@/store/uiStore';
import {Button} from '@/components/ui/Button';
import {SprinkleBurst} from '@/components/ui/SprinkleBurst';

const PICKUP_SLOTS = ['7:30 am', '8:00 am', '8:30 am', '9:00 am', '10:00 am', '11:00 am', '12:30 pm'] as const;

const schema = z
  .object({
    name: z.string().trim().min(2, 'Tell us who the box is for'),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'),
    email: z.union([z.email('Enter a valid email'), z.literal('')]),
    method: z.enum(['delivery', 'pickup']),
    address: z.string().trim(),
    zone: z.string(),
    pincode: z.string().trim(),
    slot: z.string(),
    note: z.string().trim().max(140, 'Keep it under 140 characters'),
    payment: z.enum(['upi', 'card', 'cod']),
  })
  .superRefine((v, ctx) => {
    if (v.method === 'delivery') {
      if (v.address.length < 8) ctx.addIssue({code: 'custom', path: ['address'], message: 'Add a full street address'});
      if (!v.zone) ctx.addIssue({code: 'custom', path: ['zone'], message: 'Pick your delivery zone'});
      if (!/^5600\d{2}$/.test(v.pincode)) ctx.addIssue({code: 'custom', path: ['pincode'], message: 'We deliver to 5600xx pincodes'});
    } else if (!v.slot) {
      ctx.addIssue({code: 'custom', path: ['slot'], message: 'Choose a pickup time'});
    }
  });

type FormValues = z.input<typeof schema>;
type Step = 0 | 1 | 2 | 3;

const STEP_FIELDS: Record<Exclude<Step, 3>, (keyof FormValues)[]> = {
  0: ['name', 'phone', 'email'],
  1: ['method', 'address', 'zone', 'pincode', 'slot', 'note'],
  2: ['payment'],
};
const STEP_LABELS = ['Details', 'Delivery', 'Payment', 'Done'] as const;

export function CheckoutModal() {
  const open = useUiStore((s) => s.checkoutOpen);
  const closeCheckout = useUiStore((s) => s.closeCheckout);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const clear = useCartStore((s) => s.clear);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      method: 'delivery',
      address: '',
      zone: '',
      pincode: '',
      slot: '',
      note: '',
      payment: 'upi',
    },
  });
  const {register, trigger, watch, handleSubmit, formState, reset} = form;
  const method = watch('method');
  const payment = watch('payment');

  const deliveryFee = method === 'pickup' || subtotal >= brand.delivery.freeAbove ? 0 : brand.delivery.fee;
  const total = subtotal + deliveryFee;

  const close = useCallback(() => {
    if (submitting) return;
    closeCheckout();
    if (result) {
      clear();
      reset();
      setResult(null);
      setStep(0);
    }
  }, [submitting, closeCheckout, result, clear, reset]);

  useFocusTrap(panelRef, open, close);
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const go = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const next = async () => {
    if (step === 3) return;
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) go((step + 1) as Step);
  };

  const place = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await submitOrder({
        customer: {name: values.name, phone: values.phone, email: values.email || undefined},
        fulfilment:
          values.method === 'delivery'
            ? {method: 'delivery', address: values.address, zone: values.zone, pincode: values.pincode, note: values.note || undefined}
            : {method: 'pickup', slot: values.slot, note: values.note || undefined},
        payment: values.payment,
        lines,
        totals: {subtotal, delivery: deliveryFee, total},
      });
      setResult(res);
      go(3);
    } finally {
      setSubmitting(false);
    }
  });

  const slide = {
    initial: (d: number) => ({opacity: 0, x: reduced ? 0 : d * 48}),
    animate: {opacity: 1, x: 0},
    exit: (d: number) => ({opacity: 0, x: reduced ? 0 : d * -48}),
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[3px]"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={close}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            data-lenis-prevent
            className="relative flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-cream shadow-[0_40px_120px_-30px_rgba(13,12,11,.6)] sm:rounded-[28px]"
            variants={reduced ? backdropVariants : modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {step === 3 && <SprinkleBurst />}

            <header className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4 sm:px-7">
              <div>
                <h2 id="checkout-title" className="text-lg font-medium tracking-[-0.02em]">
                  {step === 3 ? 'Order placed' : 'Checkout'}
                </h2>
                <ol className="mt-1 flex items-center gap-2" aria-label="Checkout progress">
                  {STEP_LABELS.map((label, i) => (
                    <li key={label} className="flex items-center gap-2 text-[11.5px] tracking-[0.04em]" aria-current={i === step ? 'step' : undefined}>
                      <span className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-5 bg-berry' : 'w-1.5 bg-ink/20'}`} aria-hidden="true" />
                      <span className={i === step ? 'text-ink' : 'text-ink-faint'}>{label}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close checkout"
                disabled={submitting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/12 hover:border-ink/35 disabled:opacity-40"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 2) void place();
                else void next();
              }}
              className="flex min-h-0 flex-1 flex-col"
              noValidate
            >
              <div className="grid min-h-0 flex-1 overflow-y-auto sm:grid-cols-[1fr_260px]">
                <div className="relative px-5 py-6 sm:px-7">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slide}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{duration: 0.35, ease: EASE_EXPO}}
                    >
                      {step === 0 && (
                        <fieldset className="space-y-4">
                          <legend className="sr-only">Your details</legend>
                          <Field label="Name" error={formState.errors.name} input={register('name')} autoComplete="name" autoFocus />
                          <Field label="Mobile" error={formState.errors.phone} input={register('phone')} inputMode="numeric" autoComplete="tel" placeholder="98xxxxxxxx" />
                          <Field label="Email (optional)" error={formState.errors.email} input={register('email')} type="email" autoComplete="email" />
                        </fieldset>
                      )}

                      {step === 1 && (
                        <fieldset className="space-y-5">
                          <legend className="sr-only">Delivery or pickup</legend>
                          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Fulfilment">
                            {(
                              [
                                ['delivery', 'Deliver it', `${brand.delivery.fee > 0 ? formatINR(brand.delivery.fee) : 'Free'} · free over ${formatINR(brand.delivery.freeAbove)}`],
                                ['pickup', 'I’ll pick up', `${brand.address.line1} · from 7am`],
                              ] as const
                            ).map(([value, title, sub]) => (
                              <label
                                key={value}
                                className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                                  method === value ? 'border-ink bg-ink text-white' : 'border-ink/15 hover:border-ink/40'
                                }`}
                              >
                                <input type="radio" value={value} {...register('method')} className="sr-only" />
                                <span className="block text-[15px] font-medium">{title}</span>
                                <span className={`mt-1 block text-[12px] ${method === value ? 'text-white/70' : 'text-ink-faint'}`}>{sub}</span>
                              </label>
                            ))}
                          </div>

                          {method === 'delivery' ? (
                            <div className="space-y-4">
                              <Field label="Street address" error={formState.errors.address} input={register('address')} autoComplete="street-address" placeholder="Flat, building, street" />
                              <div className="grid gap-4 sm:grid-cols-2">
                                <SelectField label="Zone" error={formState.errors.zone} input={register('zone')}>
                                  <option value="">Choose a zone</option>
                                  {brand.delivery.zones.map((zn) => (
                                    <option key={zn.name} value={zn.name}>
                                      {zn.name} · {zn.eta}
                                    </option>
                                  ))}
                                </SelectField>
                                <Field label="Pincode" error={formState.errors.pincode} input={register('pincode')} inputMode="numeric" autoComplete="postal-code" placeholder="5600xx" />
                              </div>
                            </div>
                          ) : (
                            <SelectField label="Pickup time" error={formState.errors.slot} input={register('slot')}>
                              <option value="">Choose a time</option>
                              {PICKUP_SLOTS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </SelectField>
                          )}
                          <Field label="Note for the kitchen (optional)" error={formState.errors.note} input={register('note')} placeholder="Gate code, allergies, a birthday…" />
                        </fieldset>
                      )}

                      {step === 2 && (
                        <fieldset className="space-y-4">
                          <legend className="sr-only">Payment</legend>
                          <div className="space-y-2" role="radiogroup" aria-label="Payment method">
                            {(
                              [
                                ['upi', 'UPI', 'GPay, PhonePe, Paytm'],
                                ['card', 'Card', 'Visa, Mastercard, RuPay'],
                                ['cod', 'Pay on delivery', 'Cash or UPI at the door'],
                              ] as const
                            ).map(([value, title, sub]) => (
                              <label
                                key={value}
                                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                                  payment === value ? 'border-ink' : 'border-ink/15 hover:border-ink/40'
                                }`}
                              >
                                <span>
                                  <span className="block text-[15px] font-medium">{title}</span>
                                  <span className="block text-[12px] text-ink-faint">{sub}</span>
                                </span>
                                <input type="radio" value={value} {...register('payment')} className="h-4 w-4 accent-berry" />
                              </label>
                            ))}
                          </div>
                          <p className="rounded-2xl border border-dashed border-ink/20 p-4 text-[12.5px] leading-relaxed text-ink-soft">
                            Payment is mocked in this build — no money moves. The real gateway plugs into <code className="text-ink">submitOrder()</code> in{' '}
                            <code className="text-ink">src/lib/order.ts</code>.
                          </p>
                        </fieldset>
                      )}

                      {step === 3 && result && (
                        <div className="py-6 text-center sm:py-10">
                          <motion.div
                            initial={{scale: 0, rotate: reduced ? 0 : -30}}
                            animate={{scale: 1, rotate: 0}}
                            transition={{type: 'spring', stiffness: 260, damping: 18, delay: 0.1}}
                            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-berry text-white"
                          >
                            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.div>
                          <h3 className="mt-6 text-title font-medium">Boxed.</h3>
                          <p className="mt-3 text-ink-soft">
                            Order <span className="font-medium text-ink">{result.orderId}</span> · {result.eta}
                          </p>
                          <p className="mt-1 text-[13px] text-ink-faint">We’ll text {watch('phone')} when it leaves the kitchen.</p>
                          <Button variant="ink" size="lg" onClick={close} className="mt-8" data-autofocus>
                            Back to the doughnuts
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <aside className="border-t border-rule bg-cream-deep/50 px-5 py-5 sm:border-l sm:border-t-0 sm:px-6" aria-label="Order summary">
                  <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">Summary</h3>
                  <ul className="mt-3 space-y-2 text-[13.5px]">
                    {lines.map((l) => (
                      <li key={l.key} className="flex justify-between gap-3">
                        <span className="truncate">
                          {l.qty} × {l.name}
                        </span>
                        <span className="tabular-nums">{formatINR(l.unitPrice * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 space-y-1.5 border-t border-rule pt-3 text-[13.5px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Subtotal</dt>
                      <dd className="tabular-nums">{formatINR(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">{method === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
                      <dd className="tabular-nums">{deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}</dd>
                    </div>
                    <div className="flex justify-between pt-1 text-base font-medium">
                      <dt>Total</dt>
                      <dd className="tabular-nums text-berry">{formatINR(total)}</dd>
                    </div>
                  </dl>
                </aside>
              </div>

              {step < 3 && (
                <footer className="flex items-center justify-between gap-3 border-t border-rule px-5 py-4 safe-bottom sm:px-7">
                  <Button variant="ghost" type="button" onClick={() => (step === 0 ? close() : go((step - 1) as Step))} disabled={submitting} className="px-3 text-ink-soft">
                    {step === 0 ? 'Cancel' : 'Back'}
                  </Button>
                  <Button variant="berry" size="lg" type="submit" disabled={submitting || lines.length === 0} className="min-w-[160px]">
                    {submitting ? 'Placing…' : step === 2 ? `Pay ${formatINR(total)}` : 'Continue'}
                  </Button>
                </footer>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  label: string;
  error?: FieldError;
  input: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel';
  autoFocus?: boolean;
}

const inputClass =
  'mt-1.5 w-full rounded-xl border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-ink-faint focus:border-ink';

function Field({label, error, input, type = 'text', placeholder, autoComplete, inputMode, autoFocus}: FieldProps) {
  const id = `f-${input.name}`;
  return (
    <div>
      <label htmlFor={id} className="text-[13px] text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        data-autofocus={autoFocus ? '' : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputClass} ${error ? 'border-berry' : 'border-ink/15'}`}
        {...input}
      />
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

function SelectField({label, error, input, children}: {label: string; error?: FieldError; input: UseFormRegisterReturn; children: ReactNode}) {
  const id = `f-${input.name}`;
  return (
    <div>
      <label htmlFor={id} className="text-[13px] text-ink-soft">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputClass} ${error ? 'border-berry' : 'border-ink/15'}`}
        {...input}
      >
        {children}
      </select>
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

function FieldError({id, error}: {id: string; error?: FieldError}) {
  return (
    <AnimatePresence>
      {error?.message && (
        <motion.p
          id={id}
          role="alert"
          initial={{opacity: 0, y: -4}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0}}
          className="mt-1 text-[12px] text-berry"
        >
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
