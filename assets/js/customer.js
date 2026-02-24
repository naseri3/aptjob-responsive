document.querySelectorAll('.customer-faq__question').forEach(btn => {
    btn.addEventListener('click', function () {

        const item = this.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.customer-faq__item')
            .forEach(el => el.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }

    });
});