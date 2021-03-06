const labels = document.querySelectorAll('.form-control label');
const inputs = document.querySelectorAll('.form-control input');

if (!inputs) {
  inputs.focus();
}
labels.forEach(label => {
  label.innerHTML = label.innerText
    .split('')
    .map(
      (letter, idx) => `<span 
   style="transition-delay:${idx * 50}ms">${letter}</span>`
    )
    .join('')
});

