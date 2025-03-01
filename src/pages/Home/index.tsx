import { Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from 'react'

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormdata = zod.infer<typeof newCycleFormSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondPassed, setAmountSecondPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormdata>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormdata) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0
  const currentSeconds = activeCycle
    ? totalSeconds - amountSecondPassed
    : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalher em </label>
          <TaskInput
            list="tasks-suggestions"
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="tasks-suggestions" />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={23} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
