'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are passionate about building amazing digital experiences that make a difference.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower individuals and businesses with innovative, reliable, and user-friendly 
              technology solutions that solve real-world problems and drive growth.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A world where technology seamlessly enhances everyday life, making it simpler, 
              more connected, and full of possibilities.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600 mx-auto">
            <p className="mb-6">
              Founded in 2024, we started as a small team of developers and designers with a shared 
              dream: to create products that people love to use.
            </p>
            <p className="mb-6">
              Today, we continue to grow while staying true to our core values — putting users first, 
              embracing innovation, and delivering excellence in everything we do.
            </p>
            <p>
              Whether it's crafting beautiful interfaces, building robust backend systems, or helping 
              businesses go digital, we're here to turn ideas into reality.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Innovation', desc: 'Always pushing boundaries' },
              { title: 'Quality', desc: 'Excellence in every detail' },
              { title: 'Transparency', desc: 'Open and honest communication' },
              { title: 'User-First', desc: 'You are at the heart of everything' },
            ].map((value) => (
              <div
                key={value.title}
                className="text-center bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to work with us?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Let's build something great together.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white font-medium px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}