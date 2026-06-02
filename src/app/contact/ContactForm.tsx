"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { ContactFormData } from "@/types";

interface ContactFormProps {
    formTitle?: string;
    submitButtonText?: string;
    submitButtonColor?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
    formTitle = "Bize Mesaj Gönderin",
    submitButtonText = "Gönder",
    submitButtonColor = "#0891b2"
}) => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock form gönderimi
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
        }, 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <span id="contactFormSubmitButtonColor" data-id="contactFormSubmitButtonColor" className="hidden" />
            <h2 
                id="contactFormTitle"
                data-id="contactFormTitle"
                className="text-2xl font-bold text-gray-900 mb-6"
            >
                {formTitle}
            </h2>

            {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                    yapacağız.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Ad Soyad *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ahmet Yılmaz"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        E-posta *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Mesajınız *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                    />
                </div>

                <button
                    type="submit"
                    id="contactFormSubmitButtonText"
                    data-id="contactFormSubmitButtonText"
                    className="w-full text-white py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center space-x-2 hover:opacity-90"
                    style={{
                        backgroundColor: submitButtonColor,
                    }}
                >
                    <Send className="w-5 h-5" />
                    <span>{submitButtonText}</span>
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
