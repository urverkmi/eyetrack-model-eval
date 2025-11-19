# 📘 Eye-Tracking Model Evaluation Experiment

This repository contains all code, stimuli, and instructions for running a small-scale (N=2–3) eye-tracking experiment using **WebGazer.js** to collect gaze data and compare it against predictions from an existing **scanpath-generation model**.

The experiment is part of **Assignment 5A: Evaluating a Computational Model**, where the goal is to measure how well a computational visual-attention model matches real human gaze behavior.

---

## 🔍 Project Overview

This repo provides:

- **A browser-based gaze experiment** (using WebGazer.js)  
- **Stimulus images** for participants to view  
- **A simple UI** that cycles through images and records gaze coordinates  
- **A Jupyter notebook** to:  
  - load recorded gaze data  
  - compute similarity metrics  
  - compare against your model’s predicted scanpaths  
  - generate visualizations (gaze plots, heatmaps)  
- **Instructions for deployment** via GitHub Pages  
- **Analysis plan** for working with a small sample size (N=2–3)

Participants only need a laptop with a webcam — no installation required.

---

## 🧪 How the Experiment Works

1. The participant opens the experiment in their browser.  
2. WebGazer calibrates using a 9-point grid.  
3. A sequence of stimulus images is shown (randomized).  
4. WebGazer silently records gaze coordinates over time.  
5. Data is saved as a CSV file for later analysis.

---

## 📁 Repository Structure

