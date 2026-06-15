import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

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
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Form data:', data);
    setSubmitStatus('success');
    reset();
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const inputClasses =
    'w-full h-12 px-3.5 rounded-xl border-[1.5px] border-line-strong bg-white focus:border-primary outline-none transition-colors text-[15px]';
  const textareaClasses =
    'w-full px-3.5 py-3 rounded-xl border-[1.5px] border-line-strong bg-white focus:border-primary outline-none transition-colors text-[15px] resize-none';
  const labelClasses = 'block text-[13.5px] font-semibold text-fg mb-1.5';
  const errorClasses = 'text-[12.5px] text-red-600 mt-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-line rounded-[20px] p-6 md:p-8"
    >
      <h3 className="font-display text-[22px] md:text-[24px] font-extrabold text-fg-strong mb-6">
        {i18n.language === 'mn' ? 'Бидэнд мессеж илгээх' : 'Send us a message'}
      </h3>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[#E7F6EF] text-success px-4 py-3 rounded-xl mb-6 border border-[#BFE6D4]"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
          <span className="text-sm">
            {i18n.language === 'mn' ? 'Таны мессеж амжилттай илгээгдлээ!' : 'Your message was sent successfully!'}
          </span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>{t('contact.name')} *</label>
            <input
              type="text"
              {...register('name', { required: i18n.language === 'mn' ? 'Нэр оруулна уу' : 'Name is required' })}
              className={inputClasses}
              placeholder={i18n.language === 'mn' ? 'Таны нэр' : 'Your name'}
            />
            {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>{t('contact.company')}</label>
            <input type="text" {...register('company')} className={inputClasses} placeholder={i18n.language === 'mn' ? 'Компанийн нэр' : 'Company name'} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>{t('contact.email')}</label>
            <input
              type="email"
              {...register('email', {
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: i18n.language === 'mn' ? 'И-мэйл буруу байна' : 'Invalid email' },
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
              {...register('phone', { required: i18n.language === 'mn' ? 'Утасны дугаар оруулна уу' : 'Phone is required' })}
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
              minLength: { value: 10, message: i18n.language === 'mn' ? 'Хамгийн багадаа 10 тэмдэгт' : 'Minimum 10 characters' },
            })}
            rows={5}
            className={textareaClasses}
            placeholder={i18n.language === 'mn' ? 'Таны мессеж... (Жишээ: Ямар бүтээгдэхүүн хэрэгтэй байгаа, хэдэн ширхэг гэх мэт)' : 'Your message... (e.g., which products you need, quantity, etc.)'}
          />
          {errors.message && <p className={errorClasses}>{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-xl bg-primary text-white font-bold text-[16px] hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {isSubmitting
            ? i18n.language === 'mn' ? 'Илгээж байна...' : 'Sending...'
            : t('contact.submit')}
        </button>
      </form>
    </motion.div>
  );
}
