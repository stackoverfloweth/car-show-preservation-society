<template>
  <div class="loading-ellipsis">
    <slot />
  </div>
</template>

<style>
.loading-ellipsis:after {
  width: 20px;
  display: inline-block;
  text-align: left;
  animation: ellipsis steps(1,end) 1s infinite;
  content: '';
}

@keyframes ellipsis {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
}
</style>