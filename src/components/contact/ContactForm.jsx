import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, send to your backend or email service
    console.log('Form data:', data);

    setSubmitStatus('success');
    reset();

    // Clear status after 5 seconds
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-neutral-gray
    focus:border-primary focus:ring-2 focus:ring-primary/20 
    outline-none transition-all bg-white
  `;

  const labelClasses = "block text-sm font-medium text-secondary mb-2";
  const errorClasses = "text-red-500 text-xs mt-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
    >
      <h3 className="font-display text-2xl font-bold text-secondary mb-6">
        {i18n.language === 'mn' ? 'Бидэнд мессеж илгээх' : 'Send us a message'}
      </h3>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            {i18n.language === 'mn'
              ? 'Таны мессеж амжилттай илгээгдлээ!'
              : 'Your message was sent successfully!'}
          </span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className={labelClasses}>{t('contact.name')} *</label>
          <input
            type="text"
            {...register('name', {
              required: i18n.language === 'mn' ? 'Нэр оруулна уу' : 'Name is required'
            })}
            className={inputClasses}
            placeholder={i18n.language === 'mn' ? 'Таны нэр' : 'Your name'}
          />
          {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
        </div>

        {/* Company */}
        <div>
          <label className={labelClasses}>{t('contact.company')}</label>
          <input
            type="text"
            {...register('company')}
            className={inputClasses}
            placeholder={i18n.language === 'mn' ? 'Компанийн нэр' : 'Company name'}
          />
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>{t('contact.email')}</label>
            <input
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: i18n.language === 'mn' ? 'И-мэйл буруу байна' : 'Invalid email'
                }
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
                required: i18n.language === 'mn' ? 'Утасны дугаар оруулна уу' : 'Phone is required'
              })}
              className={inputClasses}
              placeholder="+976 8820 4057"
            />
            {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClasses}>{t('contact.message')} *</label>
          <textarea
            {...register('message', {
              required: i18n.language === 'mn' ? 'Мессеж оруулна уу' : 'Message is required',
              minLength: {
                value: 10,
                message: i18n.language === 'mn' ? 'Хамгийн багадаа 10 тэмдэгт' : 'Minimum 10 characters'
              }
            })}
            rows={4}
            className={inputClasses}
            placeholder={i18n.language === 'mn'
              ? 'Таны мессеж... (Жишээ: Ямар бүтээгдэхүүн хэрэгтэй байгаа, хэдэн ширхэг гэх мэт)'
              : 'Your message... (e.g., which products you need, quantity, etc.)'}
          />
          {errors.message && <p className={errorClasses}>{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={Send}
          iconPosition="right"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (i18n.language === 'mn' ? 'Илгээж байна...' : 'Sending...')
            : t('contact.submit')
          }
        </Button>
      </form>
    </motion.div>
  );
}

