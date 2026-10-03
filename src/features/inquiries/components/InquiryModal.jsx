import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { inquiryApi } from '../../../services/api/propertyApi';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Send } from 'lucide-react';

export function InquiryModal({ isOpen, onClose, property }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await inquiryApi.sendInquiry(
        {
          propertyId: property.id,
          propertyTitle: property.title,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          ownerId: property.listedBy?.id || property.listedByUserId,
          message: formData.message || `I am interested in this property: ${property.title}. Please contact me.`,
        },
        user
      );

      toast.success('Inquiry submitted! The seller will contact you shortly.');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Property Inquiry"
      description={`Direct message to ${property.listedBy?.agencyName || property.listedBy?.name || 'Seller'}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center gap-3">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200'}
            alt={property.title}
            className="h-12 w-16 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-bold text-slate-900 truncate">{property.title}</p>
            <p className="text-slate-500">{property.locality}, {property.city}</p>
          </div>
        </div>

        <Input
          label="Your Full Name"
          required
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            type="tel"
            required
            placeholder="e.g. +91 98200 12345"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. rahul@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <Textarea
          label="Message or Questions"
          rows={3}
          placeholder="I would like to schedule a site visit this weekend. Are you open to negotiations?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Your contact info is shared only with this verified seller.</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send Inquiry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
