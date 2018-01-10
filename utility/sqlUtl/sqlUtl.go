package sqlUtl

import (
	"strings"
)

const errDupEtryMsg = "Error 1062: Duplicate entry"

func ErrDupEtry(e error) bool{
	return strings.Contains(e.Error(), errDupEtryMsg)
}
