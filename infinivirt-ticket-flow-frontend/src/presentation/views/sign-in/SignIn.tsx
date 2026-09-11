import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Ticket } from 'lucide-react';
import type { User, Role } from '../../types';
import { Link } from 'react-router-dom';
import { Input } from '../../components/input/input-component';
import { Controller } from 'react-hook-form';
import { useSignInViewModel } from './sign-in-view-model';
import { Alert } from '../../components/alert/alert-component';

interface SignInProps {}

export const SignIn: React.FC<SignInProps> = () => {
  const viewModel = useSignInViewModel();
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 antialiased bg-gradient-to-br from-background"
    >
      {/* --- Contenedor de la Tarjeta (Card) --- */}
      <div className="w-full max-w-[550px] p-10 rounded-[5px] transform transition-all duration-300 ease-out">

        {/* --- Encabezado: Logo y Título --- */}
        <div className="flex flex-col items-center mb-9 text-center">

          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FE9501] text-white shadow-md shadow-[#FE9501]-200">
              <Ticket className="h-9 w-9" />
            </div>
            <span className="text-[40px] font-bold tracking-tight text-slate-900">
              Ticket<span className="text-[#FE9501]">Flow</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            ¡Inicia sesión!
          </h1>
          <p className="text-sm text-neutral-400 max-w-[280px]">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        {viewModel.isSubmitted && viewModel.hasErrors && (
          <Alert variant="error" title="Ups!">
            Por favor, completa los campos requeridos antes de continuar.
          </Alert>
        )}

        {/* --- Formulario de Inicio de Sesión --- */}
        <form onSubmit={viewModel.handleSubmit(viewModel.signIn)} className="space-y-4">

          <Controller
            name="email"
            control={viewModel.control}
            rules={{
              required: 'El campo es obligatorio',
              validate: (value) => {
                if (!value || !value.trim()) {
                  return 'El campo es obligatorio';
                }
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                  return 'Ingresa un correo electrónico válido';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                label={"Correo electrónico"}
                placeholder={"example@gmail.com"}
                Icon={<Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                value={field.value}
                onChange={field.onChange}
                max={100}
                maxLength={100}
                isError={!!viewModel.errors.email}
              />
            )}
          />

          <Controller
            name="password"
            control={viewModel.control}
            rules={{
              required: 'El campo es obligatorio',
              validate: (value) => {
                if (!value) {
                  return 'El campo es obligatorio';
                }
              },
            }}
            render={({ field }) => (
              <Input
                type={"password"}
                label={"Correo electrónico"}
                placeholder={"******"}
                Icon={<Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                value={field.value}
                onChange={field.onChange}
                max={120}
                maxLength={120}
                isError={!!viewModel.errors.password}
              />
            )}
          />

          {/* Botón de Iniciar Sesión (Estilo Azul Vivo) */}
          <button
            type="submit"
            className="w-full h-10 bg-[#FE9501] hover:bg-[#E08D1B] text-white font-semibold rounded-[5px] shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* --- Separador Sutil (Opcional, dado que quitamos los sociales) --- */}
        {/* <div className="border-t border-neutral-800 my-8"></div> */}

        {/* --- Enlaces de Ayuda (Registro y Recuperación) --- */}
        <div className="mt-8 pt-6 border-t border-neutral-800/50 space-y-3 text-center text-sm">
          <p className="text-neutral-400">
            ¿Aún no tienes cuenta?{' '}
            <Link
              to="/sign-up"
              className="font-medium text-[#E08D1B] hover:text-[#E08D1B]-300 transition-colors hover:underline underline-offset-2"
            >
              Regístrate aquí
            </Link>
          </p>
          <Link
            to="#"
            className="block text-neutral-500 hover:text-neutral-300 transition-colors hover:underline underline-offset-2"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

      </div>

      {/* --- Elementos Decorativos de las Esquinas (Simulados) --- */}
      {/* Nota: Estos son divs vacíos posicionados absolutamente para evocar los módulos de la imagen */}
      <div className="absolute top-10 left-10 w-24 h-12 border border-neutral-800 rounded-lg opacity-20 hidden md:block"></div>
      <div className="absolute top-10 right-10 w-24 h-12 border border-neutral-800 rounded-lg opacity-20 hidden md:block"></div>
      <div className="absolute bottom-10 left-10 w-24 h-12 border border-neutral-800 rounded-lg opacity-20 hidden md:block"></div>
      <div className="absolute bottom-10 right-10 w-24 h-12 border border-neutral-800 rounded-lg opacity-20 hidden md:block"></div>
    </div>
  );
};