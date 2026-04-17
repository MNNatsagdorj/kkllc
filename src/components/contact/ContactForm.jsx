import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form data:', data);
    setSubmitStatus('success');
    reset();
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const inputClasses =
    'w-full h-11 px-3.5 rounded-sm border border-line bg-white focus:border-fg-strong outline-none transition-colors text-sm';
  const textareaClasses =
    'w-full px-3.5 py-3 rounded-sm border border-line bg-white focus:border-fg-strong outline-none transition-colors text-sm resize-none';
  const labelClasses =
    'block text-[10.5px] font-wide font-semibold uppercase tracking-[0.2em] text-fg-muted mb-2';
  const errorClasses = 'text-[12px] text-red-600 mt-1.5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-line rounded-sm"
    >
      <div className="p-6 md:p-8 lg:p-10 border-b border-line">
        <span className="section-index block text-fg-subtle mb-3">01 &nbsp;/&nbsp; INQUIRY FORM</span>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-fg-strong tracking-[-0.02em] leading-tight">
          {i18n.language === 'mn' ? 'Бидэнд ' : 'Send us a '}
          <span className="serif-accent italic text-primary font-medium">
            {i18n.language === 'mn' ? 'мессеж илгээх' : 'message'}
          </span>
        </h3>
      </div>

      <div className="p-6 md:p-8 lg:p-10">
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-50 text-accent-emerald px-4 py-3 rounded-sm mb-6 border border-emerald-200"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span className="text-sm">
              {i18n.language === 'mn'
                ? 'Таны мессеж амжилттай илгээгдлээ!'
                : 'Your message was sent successfully!'}
            </span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>{t('contact.name')} *</label>
              <input
                type="text"
                {...register('name', {
                  required: i18n.language === 'mn' ? 'Нэр оруулна уу' : 'Name is required',
                })}
                className={inputClasses}
                placeholder={i18n.language === 'mn' ? 'Таны нэр' : 'Your name'}
              />
              {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>{t('contact.company')}</label>
              <input
                type="text"
                {...register('company')}
                className={inputClasses}
                placeholder={i18n.language === 'mn' ? 'Компанийн нэр' : 'Company name'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>{t('contact.email')}</label>
              <input
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: i18n.language === 'mn' ? 'И-мэйл буруу байна' : 'Invalid email',
                  },
                })}
                className={inputClasses}
                placeholder="email@example.com"
              />
              {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>{t('contact.phone')} *</label>
              <input
                type="tel"
                {...register('phone', {
                  required:
                    i18n.language === 'mn' ? 'Утасны дугаар оруулна уу' : 'Phone is required',
                })}
                className={inputClasses}
                placeholder="+976 8820 4057"
              />
              {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClasses}>{t('contact.message')} *</label>
            <textarea
              {...register('message', {
                required: i18n.language === 'mn' ? 'Мессеж оруулна уу' : 'Message is required',
                minLength: {
                  value: 10,
                  message:
                    i18n.language === 'mn' ? 'Хамгийн багадаа 10 тэмдэгт' : 'Minimum 10 characters',
                },
              })}
              rows={5}
              className={textareaClasses}
              placeholder={
                i18n.language === 'mn'
                  ? 'Таны мессеж... (Жишээ: Ямар бүтээгдэхүүн хэрэгтэй байгаа, хэдэн ширхэг гэх мэт)'
                  : 'Your message... (e.g., which products you need, quantity, etc.)'
              }
            />
            {errors.message && <p className={errorClasses}>{errors.message.message}</p>}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-line">
            <p className="text-[11px] font-wide uppercase tracking-[0.18em] text-fg-subtle hidden sm:block">
              * {i18n.language === 'mn' ? 'Заавал бөглөх' : 'Required fields'}
            </p>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              iconPosition="right"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? i18n.language === 'mn'
                  ? 'Илгээж байна...'
                  : 'Sending...'
                : t('contact.submit')}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
