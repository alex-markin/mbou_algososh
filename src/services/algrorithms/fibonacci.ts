export function fibonacci(n: number): number[] {
  const arr: number[] = [0, 1];

  for (let i = 2; i <= n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }

  return arr;
}

