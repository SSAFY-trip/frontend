<template>
  <nav :class="['content', theme]">
    <button class="nav-link" @click="navigateTo('/')">홈</button>
    <span class="separator">|</span>
    <button class="nav-link" @click="navigateTo('/add-trip')">여행 추가하기</button>
    <span class="separator">|</span>
    <button class="nav-link" @click="navigateTo('/recommended')">추천 여행</button>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    },
  },
}
</script>

<style scoped>
.content {
  padding: 10px 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 24px;
  border: 2px solid black;
  width: 56%;
  margin-left: 25px;
  transition:
    background-color 0.3s,
    color 0.3s,
    padding 0.3s,
    gap 0.3s;
}

.content.dark {
  background-color: black;
  border-color: black;
  color: white;
}

.content.light {
  background-color: white;
  border-color: white;
  color: black;
}

.content.dark:hover {
  background-color: white;
  border-color: black;
  color: black;
}

.content.dark:hover .nav-link {
  color: black;
}

.content.dark:hover .separator {
  color: black;
}

.content.light:hover {
  background-color: black;
  border-color: white;
  color: white;
}

.content.light:hover .nav-link {
  color: white;
}

.content.light:hover .separator {
  color: white;
}

.nav-link {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 400;
  margin: 0 10px;
  color: inherit;
  cursor: pointer;
  transition:
    color 0.3s,
    font-weight 0.3s,
    margin 0.3s;
}
.nav-link:hover {
  font-weight: 800;
}
.separator {
  font-size: 16px;
  margin: 0 5px;
  transition: color 0.3s;
}

.content.dark .nav-link {
  color: white;
}

.content.light .nav-link {
  color: black;
}

.content.dark .separator {
  color: white;
}

.content.light .separator {
  color: black;
}

@media (max-width: 1200px) {
  .content {
    padding: 5px 10px;
    gap: 5px;
    width: 60%;
  }

  .nav-link {
    font-size: 12px;
    margin: 0 5px;
  }

  .separator {
    font-size: 12px;
    margin: 0 3px;
  }
}

@media (max-width: 780px) {
  .content {
    padding: 3px 5px;
    gap: 3px;
    width: 90%;
  }

  .nav-link {
    font-size: 10px;
    margin: 0 3px;
  }

  .separator {
    font-size: 10px;
    margin: 0 2px;
  }
}
</style>
