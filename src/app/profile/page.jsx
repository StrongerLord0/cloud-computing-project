"use client"
import React, { useEffect, useState, useRef } from "react";
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import EmotionsHistogram from "@/components/charts/EmotionsHistogram";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, isSameDay, format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAppContext } from "@/context/AppContext";

export default function Profile() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [maxDetections, setMaxDetections] = useState([]);
  const datePickerRef = useRef();
  const { sharedData } = useAppContext();

  const countEmotionsByDay = (emotions) => {
    const emotionCounts = { Enojo: 0, Disgusto: 0, Temor: 0, Feliz: 0, Neutral: 0, Triste: 0, Sorpresa: 0 };

    emotions.forEach(item => {
      const emotion = translateEmotion(item.emotion);
      emotionCounts[emotion]++;
    });

    return Object.keys(emotionCounts).map(emotion => ({
      name: emotion,
      Detecciones: emotionCounts[emotion]
    }));
  };

  const translateEmotion = (emotion) => {
    switch (emotion) {
      case 'angry': return 'Enojo';
      case 'disgust': return 'Disgusto';
      case 'fear': return 'Temor';
      case 'happy': return 'Feliz';
      case 'neutral': return 'Neutral';
      case 'sad': return 'Triste';
      case 'surprise': return 'Sorpresa';
      default: return 'Desconocido';
    }
  };

  const fetchPersonalStats = async () => {
    const response = await fetch(`/api/statistics/`, { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setFilteredData(data); // Inicialmente mostramos todos los datos
      const emotionsByDay = countEmotionsByDay(data);
      const maxDetectionsValue = Math.max(...emotionsByDay.map(item => item.Detecciones));
      setMaxDetections(Array.from({ length: maxDetectionsValue + 1 }, (_, i) => i));
    } else {
      console.error('Error:', response.status);
    }
  };

  const fetchOthersStats = async () => {
    const response = await fetch(`/api/statistics/${sharedData._id}`, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setFilteredData(data);
      const emotionsByDay = countEmotionsByDay(data);
      const maxDetectionsValue = Math.max(...emotionsByDay.map(item => item.Detecciones));
      setMaxDetections(Array.from({ length: maxDetectionsValue + 1 }, (_, i) => i));
    } else {
      console.error('Error:', response.status);
    }
  };

  useEffect(() => {
    if (sharedData) {
      fetchOthersStats();
      console.log(sharedData);
    } else {
      fetchPersonalStats();
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = data.filter(item => isSameDay(parseISO(item.date), selectedDate));
      setFilteredData(filtered);
      const emotionsByDay = countEmotionsByDay(filtered);
      const maxDetectionsValue = Math.max(...emotionsByDay.map(item => item.Detecciones));
      setMaxDetections(Array.from({ length: maxDetectionsValue + 1 }, (_, i) => i));
    } else {
      setFilteredData(data);
      const emotionsByDay = countEmotionsByDay(data);
      const maxDetectionsValue = Math.max(...emotionsByDay.map(item => item.Detecciones));
      setMaxDetections(Array.from({ length: maxDetectionsValue + 1 }, (_, i) => i));
    }
  }, [selectedDate, data]);

  return (
    <div
      className="flex w-screen h-screen flex-col bg-cover items-center"
      style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%" }}
    >
      <Navigation />
      <motion.div
        className="flex w-full h-full items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 1.2 }}
      >
        <div className="flex w-1/3 h-full flex-col text-center text-white items-center justify-start border-r-4 border-r-zinc-900">
          {session ? (
            <>
              <img src={session.user.image.substring(0, session.user.image.lastIndexOf("="))} className="flex w-3/5 aspect-square" />
              <p className="w-3/5 pt-6 text-md text-left font-extralight leading-relaxed font-raleway text-white">
                {session.user.name}
              </p>
              <p className="w-3/5 pt-1 text-md text-left font-extralight leading-relaxed font-raleway text-white">
                {session.user.email}
              </p>
            </>
          ) : null}
          <div className="flex w-full gap-5 mt-8 items-center justify-center">
            <button onClick={() => { signOut({ callbackUrl: '/', redirect: true }) }} className="w-auto py-2 px-3 bg-zinc-700 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-zinc-800">
              Cerrar Sesión
            </button>
            {session && (session.user.email === "adan10104334@gmail.com" || session.user.email === "adricoque.coqa@gmail.com") ? (
              <button className="w-auto py-2 px-3 bg-zinc-900 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-black">
                <Link className="w-full" href="/admin">Administrador</Link>
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col w-2/3 h-full text-center text-white items-center justify-start">
          <div className="flex flex-col w-4/5 h-1/6 text-right justify-end">
            {
              sharedData ? (
                <>
                  <div className="text-xl w-full text-right font-extralight mb-2">Historial de actividad</div>
                  <div className="text-md w-full text-right font-light mb-2">Usuario: {sharedData.name}</div>
                  <div className="text-md w-full text-right font-extralight mb-2">
                    {selectedDate ? format(selectedDate, "dd 'de' MMMM 'del' yyyy", { locale: es }) : 'Histograma completo'}
                    <button
                      onClick={() => datePickerRef.current.setOpen(true)}
                      className="ml-2 text-md"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗓️
                    </button>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      ref={datePickerRef}
                      className="hidden" // Oculta el input de DatePicker
                      popperClassName="date-picker-popper"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl w-full text-right font-extralight mb-2">Tu historial de actividad</div>
                  <div className="text-md w-full text-right font-extralight mb-2">
                    {selectedDate ? format(selectedDate, "dd 'de' MMMM 'del' yyyy", { locale: es }) : 'Histograma completo'}
                    <button
                      onClick={() => datePickerRef.current.setOpen(true)}
                      className="ml-2 text-md"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗓️
                    </button>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      ref={datePickerRef}
                      className="hidden" // Oculta el input de DatePicker
                      popperClassName="date-picker-popper"
                    />
                  </div>
                </>
              )
            }
          </div>
          <EmotionsHistogram
            data={countEmotionsByDay(filteredData)}
            maxDetections={maxDetections}
          />
        </div>
      </motion.div>
    </div>
  );
}
