package context

import (
	"time"
)

var Schedule *Scheduler

type Scheduler struct {
	idCount int
	tickers map[int]*time.Ticker
	timers  map[int]*time.Timer
}

func (s *Scheduler) AddTicker(d time.Duration, f func()) int {
	// increment id count and assign
	s.idCount += 1
	id := s.idCount

	// create ticker and start it
	ticker := time.NewTicker(d)
	go func() {
		for range ticker.C {
			f()
		}
	}()

	// add it to map for tracking later
	s.tickers[id] = ticker

	return id
}
