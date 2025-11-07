"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Employee } from '@/types';
import { useState } from 'react';

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="group perspective-1000" onClick={handleFlip}>
      <div
        className={`relative w-64 h-64 transform-style-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        } group-hover:rotate-y-180`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Image
            src={employee.photo_url!}
            alt={employee.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-secondary text-white p-4 rounded-lg flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold">{employee.name}</h2>
          <p className="text-gray-200">Department: {employee.department}</p>
          <Link href={`/directory/${employee.id}`} className="mt-4 bg-primary text-black px-4 py-2 rounded">
            Preview Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
