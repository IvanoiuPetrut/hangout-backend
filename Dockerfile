# Folosește imaginea de bază node:18-alpine pentru a avea un mediu Node.js ușor in sistemul de operare Alpine Linux
FROM node:18-alpine

# Creează un director de lucru pentru aplicație
WORKDIR /app

# Copiază fișierele package.json și package-lock.json în directorul de lucru
COPY package*.json ./

# Instalează dependințele aplicației
RUN npm install

# Copiază toate fișierele din directorul curent în directorul de lucru
COPY . .

# Generează fișierele necesare pentru Prisma, ORM-ul folosit în aplicație
RUN npx prisma generate

# Compilează aplicația
COPY prisma ./prisma

# Rulează comanda de build pentru a compila aplicația din TypeScript în JavaScript
RUN npm run build

# Expune portul 3000 pentru a putea fi accesat de către alte aplicații
EXPOSE 3000

# Setează utilizatorul implicit pentru a fi unul non-root
USER node

# Rulează aplicația care a fost compilată de comanda de build
CMD ["node", "dist/index.js"]

# Setează utilizatorul implicit pentru a fi unul root pentru a putea rula comenzi care necesită permisiuni de root
USER root