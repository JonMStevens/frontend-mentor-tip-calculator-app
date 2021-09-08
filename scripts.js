/* button click events */
function btnTipClick(event) {
  if (!event instanceof PointerEvent || !'target' in event) {
    return;
  }

  const button = event.target;
  const percent = parseInt(button.value);
  if (typeof percent !== 'number' || isNaN(percent)) {
    return;
  }

  clearSelectedButton();
  button.setAttribute('data-selected', '');

  hideCustomTipInput();

  recalculateTotals();
}

function clearSelectedButton() {
  const selectedButton = document.querySelector('button[data-selected]');

  if (selectedButton instanceof HTMLButtonElement) {
    selectedButton.removeAttribute('data-selected');
  }
}

function btnCustomTipClick() {
  clearSelectedButton();
  showCustomTipInput();
}

function btnResetOnClick() {
  const inputBill = document.getElementById('inputBill');
  const inputCustomTip = document.getElementById('inputCustomTip');
  const inputNumberOfPeople = document.getElementById('inputNumberOfPeople');
  if (inputBill && 'value' in inputBill) inputBill.value = 0;
  if (inputCustomTip && 'value' in inputCustomTip) inputCustomTip.value = 0;
  if (inputNumberOfPeople && 'value' in inputNumberOfPeople)
    inputNumberOfPeople.value = 1;

  clearSelectedButton();
}

/* text input events */
function inputBillOnChange() {
  recalculateTotals();
}

function inputCustomTipOnChange() {
  recalculateTotals();
}

function inputNumberOfPeopleOnChange() {
  const inputNumberOfPeople = document.getElementById('inputNumberOfPeople');
  if (!validateTextInput(inputNumberOfPeople)) return;

  const count = parseInt(inputNumberOfPeople.value);
  if (count < 1) {
    showLessThanOnePersonError();
    return;
  }

  hideLessThanOnePersonError();
  recalculateTotals();
}

function showLessThanOnePersonError() {
  changeLessThanOnePersonErrorVisibility(true);
}

function hideLessThanOnePersonError() {
  changeLessThanOnePersonErrorVisibility(false);
}

function changeLessThanOnePersonErrorVisibility(visible) {
  const lblZero = document.getElementById('lblZero');
  const inputNumberOfPeople = document.getElementById('inputNumberOfPeople');
  if (lblZero instanceof HTMLElement) {
    lblZero.style.display = visible ? 'revert' : 'none';
  }
  if (inputNumberOfPeople instanceof HTMLElement) {
    inputNumberOfPeople.className = visible ? 'error' : '';
  }
}
/* custom tip input show/hide functions */
function changeCustomTipVisibility(showInput) {
  const btnTipCustom = document.getElementById('btnTipCustom');
  const inputCustomTip = document.getElementById('inputCustomTip');

  btnTipCustom.style.display = showInput ? 'none' : 'revert';
  inputCustomTip.style.display = !showInput ? 'none' : 'revert';
}

function showCustomTipInput() {
  changeCustomTipVisibility(true);
}

function hideCustomTipInput() {
  changeCustomTipVisibility(false);
}

/* validation */
function validateTextInput(ele) {
  if (!ele instanceof HTMLInputElement) return false;
  if (!'value' in ele) return false;

  const value = parseInt(ele.value);
  if (isNaN(value)) return false;

  return true;
}
/* calculate totals functions */

/* todo: this formatter causes issues with rounding:
e.g. $1000 / 10% tip / 3 people
$100 tip / 3 shows $33.33.
33.33 * 3 = 99.99 leaving one penny unaccounted.

$1100 total / 3 shows $366.67
366.67 * 3 = 1100.01 confusingly leaving one extra penney 

 */
const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function recalculateTotals() {
  const inputBill = document.getElementById('inputBill');
  const inputCustomTip = document.getElementById('inputCustomTip');
  const inputNumberOfPeople = document.getElementById('inputNumberOfPeople');

  let valid = validateTextInput(inputBill);
  valid = valid && validateTextInput(inputCustomTip);
  valid = valid && validateTextInput(inputCustomTip);

  if (!valid) {
    return;
  }

  const bill = parseInt(inputBill.value);
  const tipPercent = getTipPercent();
  const numberOfPeople = parseInt(inputNumberOfPeople.value);

  if (numberOfPeople < 1) {
    return;
  }

  const tip = (tipPercent / 100) * bill;

  const tipPerPerson = tip / numberOfPeople;

  const grandTotal = bill + tip;
  const totalperPerson = grandTotal / numberOfPeople;

  /* todo rounding */
  const valTipPerPerson = document.getElementById('valTipPerPerson');
  const valTotalPerPerson = document.getElementById('valTotalPerPerson');

  valTipPerPerson.innerText = moneyFormatter.format(tipPerPerson);
  valTotalPerPerson.innerText = moneyFormatter.format(totalperPerson);
}

function getTipPercent() {
  const selectedButton = document.querySelector('button[data-selected]');
  let value = null;
  if (selectedButton && 'value' in selectedButton) {
    value = parseInt(selectedButton.value);
  }

  const inputCustomTip = document.getElementById('inputCustomTip');
  if (
    value !== null &&
    inputCustomTip &&
    inputCustomTip.style.display !== 'none' &&
    'value' in inputCustomTip
  ) {
    value = parseInt(inputCustomTip.value);
  }

  if (value && !isNaN(value) && value >= 0) {
    return value;
  }

  return 0;
}
