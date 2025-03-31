import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiClient } from "services/api/service";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "", lastname: "", new_password: "" });
  const [errors, setErrors] = useState({ email: "", lastname: "", new_password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", lastname: "", new_password: "" };

    if (!form.email) {
      newErrors.email = "Введите почту";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Некорректный формат почты";
      valid = false;
    }

    if (!form.lastname) {
      newErrors.lastname = "Введите фамилию";
      valid = false;
    }

    if (!form.new_password) {
      newErrors.new_password = "Введите новый пароль";
      valid = false;
    } else if (form.new_password.length < 8) {
      newErrors.new_password = "Пароль должен быть не менее 8 символов";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await apiClient.post("users/profile/reset-password/", form);
      toast.success("Пароль успешно изменён");
      navigate("/sign-in");
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.error || "Ошибка восстановления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-6 bg-gray-2 rounded-md shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Восстановление пароля</h2>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Введите почту"
            className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder="Введите фамилию"
            className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
          />
          {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            placeholder="Новый пароль"
            className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
          />
          {errors.new_password && <span className="text-red-500 text-sm">{errors.new_password}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold disabled:opacity-50"
        >
          {loading ? "Смена..." : "Сменить пароль"}
        </button>
      </form>
    </main>
  );
};

export default ForgotPassword;
