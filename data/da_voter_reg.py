import pandas as pd
import matplotlib.pyplot as plt
from os.path import dirname, abspath

parent_dir = dirname(abspath(__file__))
# Load data from CSV file
df = pd.read_csv(parent_dir +'/data_voter_registration.csv')
print(df.columns)

# Plotting
plt.figure(figsize=(12, 6))
plt.subplot(211)
plt.plot(df['Iteration'], df['TimeRegisterVoter (ms)'], marker='o', label='TimeRegisterVoter (ms)')
plt.title('TimeRegisterVoter vs. Iteration')
plt.xlabel('Iteration')
plt.ylabel('TimeRegisterVoter (ms)')
plt.legend()

plt.subplot(212)
plt.plot(df['Iteration'], df['Gas Cost (USD)'], marker='o', label='Gas Cost (USD)')
plt.title('Gas Cost vs. Iteration')
plt.xlabel('Iteration')
plt.ylabel('Gas Cost (USD)')
plt.legend()

plt.tight_layout()
plt.show()
