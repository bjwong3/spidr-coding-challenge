import { useState } from 'react';
import './App.css';


function App() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cost: '',
    pin: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper for PIN formatting
  const formatPin = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '').slice(0, 16);
    // Add dashes
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  // Helper for phone formatting
  const formatPhone = (value: string) => {
    // return nothing if no value
  if (!value) return value; 

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length; 

  // returns: "x", "xx", "xxx"
  if (cvLength < 4) return currentValue; 

  // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
  if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`; 

  // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
  return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`; 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'pin') {
      newValue = formatPin(value);
    }
    if (name === 'phone') {
      newValue = formatPhone(value);
    }
    if (name === 'cost'){
      newValue = value.replace(/[^0-9.]/g, '');
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    // Update phone validation to match (XXX) XXX-XXXX
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number in format (XXX) XXX-XXXX.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!/^\d+(\.\d{1,2})?$/.test(form.cost)) newErrors.cost = 'Enter a valid dollar amount.';
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(form.pin)) newErrors.pin = 'PIN must be 16 digits in format ####-####-####-####.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Print to console
      console.log('Form Data:', form);
      alert('Form submitted! Check the console for data.');
    }
  };

  return (
      <form className="user-form" onSubmit={handleSubmit} aria-labelledby="form-title" noValidate>
        <h1>Air Fryer Interest Form</h1>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            required
          />
          {errors.firstName && <span className="error" id="firstName-error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            required
          />
          {errors.lastName && <span className="error" id="lastName-error">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            required
            placeholder="e.g. (555) 123-4567"
          />
          {errors.phone && <span className="error" id="phone-error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
            placeholder="e.g. example@email.com"
          />
          {errors.email && <span className="error" id="email-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cost">Guess the Air Fryer's Cost (USD)</label>
          <input
            id="cost"
            name="cost"
            type="text"
            inputMode="decimal"
            value={form.cost}
            onChange={handleChange}
            aria-invalid={!!errors.cost}
            aria-describedby={errors.cost ? 'cost-error' : undefined}
            required
            placeholder="e.g. 99.99"
            className="input-style input-line"
          />
          {errors.cost && <span className="error" id="cost-error">{errors.cost}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="pin">16-digit PIN</label>
          <input
            id="pin"
            name="pin"
            type="tel"
            inputMode="numeric"
            value={form.pin}
            onChange={handleChange}
            aria-invalid={!!errors.pin}
            aria-describedby={errors.pin ? 'pin-error' : undefined}
            required
            placeholder="####-####-####-####"
            maxLength={19}
            pattern="\\d{4}-\\d{4}-\\d{4}-\\d{4}"
          />
          {errors.pin && <span className="error" id="pin-error">{errors.pin}</span>}
        </div>
        <button type="submit" className="submit-btn submit-btn-line">Submit</button>
      </form>
  );
}

export default App;
