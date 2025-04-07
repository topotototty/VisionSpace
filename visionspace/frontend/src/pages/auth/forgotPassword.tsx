import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiClient } from "services/api/service";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
    lastname: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.email) {
      toast.error("Введите почту");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Некорректный формат почты");
      return false;
    }

    if (!form.lastname) {
      toast.error("Введите фамилию");
      return false;
    }

    if (!form.new_password) {
      toast.error("Введите новый пароль");
      return false;
    }

    if (form.new_password.length < 8) {
      toast.error("Пароль должен быть не менее 8 символов");
      return false;
    }

    if (!form.confirm_password) {
      toast.error("Повторите новый пароль");
      return false;
    }

    if (form.new_password !== form.confirm_password) {
      toast.error("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await apiClient.post("users/profile/reset-password/", {
        email: form.email,
        lastname: form.lastname,
        new_password: form.new_password,
      });

      toast.success("Пароль успешно изменён");
      setTimeout(() => navigate("/sign-in"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Ошибка восстановления");
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
        <h2 className="text-2xl font-bold text-center text-white">Восстановление пароля</h2>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Введите почту"
          className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
        />

        <input
          type="text"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          placeholder="Введите фамилию"
          className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
        />

        <input
          type="password"
          name="new_password"
          value={form.new_password}
          onChange={handleChange}
          placeholder="Новый пароль"
          className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
        />

        <input
          type="password"
          name="confirm_password"
          value={form.confirm_password}
          onChange={handleChange}
          placeholder="Повторите пароль"
          className="px-4 py-2 rounded bg-dark-1 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold disabled:opacity-50"
        >
          {loading ? "Смена..." : "Сменить пароль"}
        </button>
      </form>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
};

export default ForgotPassword;
