<template>
  <nav class="main-navbar">
    <!-- LOGO -->
    <div class="logo-box">BARTIFY</div>

    <!-- searchbar -->
    <div class="search-container">
      <input type="text" placeholder="Search bar" class="search-input" />
      <button class="search-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </div>

    <!-- BOTONES -->
    <div class="actions-container">
      <button class="action-btn">
        <span class="icon">📍</span>
        <span class="text">Enviar</span>
      </button>
      
      <button class="action-btn">
        <span class="icon">👤</span>
        <span class="text">Cuenta</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.main-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--brand-cream);
  padding: 20px 40px;
  border-bottom: 12px solid var(--brand-sand); 
}

.logo-box {
  background-color: var(--brand-orange);
  color: white;
  font-weight: bold;
  font-size: 1.6rem;
  padding: 12px 32px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.search-container {
  display: flex;
  flex: 1;
  max-width: 650px;
  margin: 0 30px;
  background-color: var(--brand-orange);
  padding: 6px;
  border-radius: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  border: none;
  background-color: #ff5233; /* Tono naranja claro interno */
  padding: 12px 18px;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.85);
}

.search-input:focus {
  outline: none;
}

.search-btn {
  background: none;
  border: none;
  color: #2b1d1c;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.actions-container {
  display: flex;
  gap: 20px;
}

.action-btn {
  background-color: var(--brand-orange);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  min-width: 75px;
}

.action-btn .icon {
  font-size: 1.4rem;
  margin-bottom: 2px;
}
</style>