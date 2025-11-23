(function () {
  const form = document.getElementById('subsidyForm');
  const modal = document.getElementById('successModal');
  const resultEnergyLevel = document.getElementById('resultEnergyLevel');
  const resultOriginalPrice = document.getElementById('resultOriginalPrice');
  const resultDiscountedPrice = document.getElementById('resultDiscountedPrice');

  function showModal() {
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  function resetErrors() {
    const errorMsgs = document.querySelectorAll('.error-msg');
    errorMsgs.forEach(function (el) {
      el.textContent = '';
    });

    const groups = document.querySelectorAll('.form-group, .agree-row');
    groups.forEach(function (group) {
      group.classList.remove('has-error');
    });
  }

  function setFieldError(fieldName, message) {
    const errorEl = document.querySelector('.error-msg[data-error-for="' + fieldName + '"]');
    if (errorEl) {
      errorEl.textContent = message || '';
    }

    if (fieldName === 'agreePrivacy') {
      const agreeRow = document.querySelector('.agree-row');
      if (agreeRow && message) {
        agreeRow.classList.add('has-error');
      }
      return;
    }

    const inputEl = document.getElementById(fieldName === 'idCard' ? 'idCard' : fieldName);
    if (inputEl && inputEl.parentElement && message) {
      inputEl.parentElement.classList.add('has-error');
    }
  }

  function validateForm(values) {
    const errors = {};

    if (!values.name || values.name.trim().length === 0) {
      errors.name = '请输入姓名';
    } else if (values.name.trim().length < 2) {
      errors.name = '姓名长度至少为 2 个字符';
    }

    const phonePattern = /^1[3-9]\d{9}$/;
    if (!values.phone || values.phone.trim().length === 0) {
      errors.phone = '请输入手机号码';
    } else if (!phonePattern.test(values.phone.trim())) {
      errors.phone = '请输入有效的中国大陆手机号码';
    }

    const idPattern = /^(\d{15}|\d{17}[0-9Xx])$/;
    if (!values.idCard || values.idCard.trim().length === 0) {
      errors.idCard = '请输入身份证号';
    } else if (!idPattern.test(values.idCard.trim())) {
      errors.idCard = '身份证号格式不正确';
    }

    if (!values.energyLevel || values.energyLevel.trim().length === 0) {
      errors.energyLevel = '请选择能效类型';
    }

    if (values.price == null || values.price === '') {
      errors.price = '请输入全国统一价';
    } else {
      var priceNum = parseFloat(values.price);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        errors.price = '请输入大于 0 的有效金额';
      }
    }

    if (!values.address || values.address.trim().length === 0) {
      errors.address = '请输入详细地址';
    } else if (values.address.trim().length < 5) {
      errors.address = '详细地址至少为 5 个字符';
    }

    if (!values.agreePrivacy) {
      errors.agreePrivacy = '请勾选确认已阅读并同意隐私政策';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
    };
  }

  function formatPrice(num) {
    return Number(num).toFixed(2);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const submitBtn = form.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      resetErrors();

      const formData = {
        name: form.name.value,
        phone: form.phone.value,
        idCard: form.idCard.value,
        energyLevel: form.energyLevel.value,
        price: form.price.value,
        address: form.address.value,
        agreePrivacy: form.agreePrivacy && form.agreePrivacy.checked,
      };

      const { isValid, errors } = validateForm(formData);

      if (!isValid) {
        Object.keys(errors).forEach(function (key) {
          setFieldError(key, errors[key]);
        });
        if (submitBtn) {
          submitBtn.disabled = false;
        }
        return;
      }

      const originalPriceNum = parseFloat(formData.price);
      let discountRate = 0.8;
      let energyLabel = '';

      if (formData.energyLevel === '1') {
        discountRate = 0.8;
        energyLabel = '一级能效（80%）';
      } else if (formData.energyLevel === '2') {
        discountRate = 0.85;
        energyLabel = '二级能效（85%）';
      }

      const discountedPriceNum = originalPriceNum * discountRate;

      if (resultEnergyLevel) resultEnergyLevel.textContent = energyLabel;
      if (resultOriginalPrice) resultOriginalPrice.textContent = formatPrice(originalPriceNum);
      if (resultDiscountedPrice) resultDiscountedPrice.textContent = formatPrice(discountedPriceNum);

      showModal();

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      const target = event.target;
      if (target && target.hasAttribute('data-modal-close')) {
        hideModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
        hideModal();
      }
    });
  }

  // 通用模态框控制函数
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  // 隐私政策弹窗逻辑
  const privacyLink = document.getElementById('privacyLink');
  const privacyModal = document.getElementById('privacyModal');

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', () => openModal(privacyModal));

    privacyModal.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('[data-modal-close]')) {
        closeModal(privacyModal);
      }
    });
  }
})();
